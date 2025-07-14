import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';

const FormResponses = () => {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [questionMap, setQuestionMap] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('googleAccessToken');

  // Fetch form structure to map questionId → question text
  const fetchFormMetadata = async () => {
    const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    const map = {};
    (data.items || []).forEach((item) => {
      if (item.questionItem?.question) {
        map[item.questionItem.question.questionId] = item.title;
      }
    });

    return map;
  };

  const fetchResponses = async () => {
    try {
      setLoading(true);

      const [questions, responseRes] = await Promise.all([
        fetchFormMetadata(),
        fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const data = await responseRes.json();
      setQuestionMap(questions);
      setResponses(data.responses || []);
    } catch (err) {
      console.error('Error fetching responses:', err);
    } finally {
      setLoading(false);
    }
  };

  // CSV download handler
  const handleDownloadCSV = () => {
    if (!responses.length) return;
    const headers = ['Timestamp', ...Object.values(questionMap)];
    const rows = responses.map((res) => {
      const row = [
        new Date(res.createTime).toLocaleString(),
        ...Object.keys(questionMap).map(
          (qid) =>
            res.answers?.[qid]?.textAnswers?.answers
              ?.map((a) => a.value)
              .join(', ') || ''
        ),
      ];
      return row;
    });
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((v) => '"' + (v || '').replace(/"/g, '""') + '"').join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form_${formId}_responses.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchResponses();
  }, [formId]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Form Responses
      </Typography>
      {/* Download CSV Button */}
      <Button variant="outlined" sx={{ mb: 2 }} onClick={handleDownloadCSV} disabled={responses.length === 0}>
        Download CSV
      </Button>

      {loading ? (
        <CircularProgress />
      ) : responses.length === 0 ? (
        <Typography>No responses submitted yet.</Typography>
      ) : (
        <Paper sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Timestamp</strong></TableCell>
                {Object.values(questionMap).map((qText, i) => (
                  <TableCell key={i}><strong>{qText}</strong></TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {responses.map((res, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {new Date(res.createTime).toLocaleString()}
                  </TableCell>
                  {Object.keys(questionMap).map((qid, j) => (
                    <TableCell key={j}>
                      {res.answers?.[qid]?.textAnswers?.answers
                        ?.map((a) => a.value)
                        .join(', ') || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default FormResponses;

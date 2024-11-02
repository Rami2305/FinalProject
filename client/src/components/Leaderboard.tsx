// import React from 'react';
import { Card, CardHeader, CardContent, Typography } from '@mui/material';


const Leaderboard = () => {
  const funFacts = [
    'Did you know that the word "trivia" comes from the Latin word "trivialis", which means "common" or "ordinary"?',
    'The Guinness Book of World Records has a category for the most trivia questions answered correctly in 24 hours.',
    'Trivia became popular in the United States in the 1960s thanks to television shows like "Jeopardy!" and "Trivial Pursuit".',
    'The first commercially released trivia game was "Trivial Pursuit" in 1982.',
    'The most incorrectly answered trivia question is: "What is the driest place on Earth?". The correct answer is Antarctica.',
  ];

  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];

  return (
    <div style={{ backgroundColor: '#f0f9f4', padding: '20px' }}>
    <Card sx={{ maxWidth: 400, mx: 'auto' }}>
      <CardHeader title="Leaderboard Under Construction" />
      <CardContent>
        <Typography variant="body1" gutterBottom>
          We're preparing an amazing leaderboard with surprises and prizes for you. Keep playing and racking up those points!
        </Typography>
        <Card sx={{ bgcolor: 'success.light', p: 2, mb: 2 }}>
          <Typography variant="h6" color="success.dark" gutterBottom>
            Trivia Fun Fact:
          </Typography>
          <Typography variant="body2" color="success.main">
            {randomFact}
          </Typography>
        </Card>
      </CardContent>
    </Card>
  </div>
  );
};

export default Leaderboard;
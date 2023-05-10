// frontend/src/pages/StatsPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StatsPage.css';
import Histogram from '../components/Histogram';

interface Stats {
    totalGainLoss: number;
    totalNormalizedGainLossPercentage: number;
    averageNormalizedGainLossPercentage: number;
    averageGainLossPercentage: number;
    closedPositionsCount: number;
    quarterPositions: number;
    halfPositions: number;
    fullPositions: number;
    winningTrades: number;
    losingTrades: number;
    winningQuarter: number;
    losingQuarter: number;
    winningHalf: number;
    losingHalf: number;
    winningFull: number;
    losingFull: number;
    averageNormalizedGainLossPercentageQuarter: number;
    averageNormalizedGainLossPercentageHalf: number;
    averageNormalizedGainLossPercentageFull: number;
    averageGainLossPercentageQuarter: number;
    averageGainLossPercentageHalf: number;
    averageGainLossPercentageFull: number;
    averageGainPercentageQuarter: number;
    averageGainPercentageHalf: number;
    averageGainPercentageFull: number;
    averageLossPercentageQuarter: number;
    averageLossPercentageHalf: number;
    averageLossPercentageFull: number;
    averageGainPercentageTotal: number;
    averageLossPercentageTotal: number;
    averageNormalizedGainPercentageTotal: number;
    averageNormalizedLossPercentageTotal: number;
    battingAverageQuarter: number;
    battingAverageHalf: number;
    battingAverageFull: number;
    battingAverageTotal: number;
    rrQuarter: number;
    rrHalf: number;
    rrFull: number;
    rrTotal: number;
    rrNormalizedTotal: number;
    quarterHistogram: Array<number>;
    halfHistogram: Array<number>;
    fullHistogram: Array<number>;
    totalHistogram: Array<number>;
  }
  
  const StatsPage = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState<null | string>(null);
  
    useEffect(() => {
      const fetchStats = async () => {
        try {
          const response = await axios.get('http://localhost:3001/positions/stats');
          setStats(response.data);
        } catch (err) {
          setError('Failed to fetch stats');
        }
      };
  
      fetchStats();
    }, []);
  
    if (error) {
      return <p>{error}</p>;
    }
  
    if (!stats) {
      return <p>Loading...</p>;
    }
  
    const generateLabels = () => {
      const labels = ['Less than -40%'];
      for (let i = -40; i < 40; i += 2) {
        labels.push(`${i}% to ${i + 2}%`);
      }
      labels.push('More than 40%');
      return labels;
    };
  
    const histogramLabels = generateLabels();
  
    const statSections = [
      {
        title: 'Total Positions',
        data: [
          ['Winning', stats.winningTrades],
          ['Losing', stats.losingTrades],
          ['Closed', stats.closedPositionsCount],
          ['Avg G', stats.averageGainPercentageTotal.toFixed(2)],
          ['Avg L', stats.averageLossPercentageTotal.toFixed(2)],
          ['Avg G/L', stats.averageGainLossPercentage.toFixed(2)],
          ['Avg Norm G/L', stats.averageNormalizedGainLossPercentage.toFixed(2)],
          ['Batting Avg', stats.battingAverageTotal.toFixed(2)],
          ['R/R', stats.rrTotal.toFixed(2)],
          ['R/R norm', stats.rrNormalizedTotal.toFixed(2)],
        ],
      },
      {
        title: 'Quarter Positions',
        data: [
          ['Winning', stats.winningQuarter],
          ['Losing', stats.losingQuarter],
          ['Closed', stats.quarterPositions],
          ['Avg G', stats.averageGainPercentageQuarter.toFixed(2)],
          ['Avg L', stats.averageLossPercentageQuarter.toFixed(2)],
          ['Avg G/L', stats.averageGainLossPercentageQuarter.toFixed(2)],
          ['Batting Avg', stats.battingAverageQuarter.toFixed(2)],
          ['R/R', stats.rrQuarter.toFixed(2)],
        ],
      },
      {
        title: 'Half Positions',
        data: [
          ['Winning', stats.winningHalf],
          ['Losing', stats.losingHalf],
          ['Closed', stats.halfPositions],
          ['Avg G', stats.averageGainPercentageHalf.toFixed(2)],
          ['Avg L', stats.averageLossPercentageHalf.toFixed(2)],
          ['Avg G/L %', stats.averageGainLossPercentageHalf.toFixed(2)],
          ['Batting Avg', stats.battingAverageHalf.toFixed(2)],
          ['R/R', stats.rrHalf.toFixed(2)],
        ],
      },
      {
        title: 'Full Positions',
        data: [
          ['Winning', stats.winningFull],
          ['Losing', stats.losingFull],
          ['Closed', stats.fullPositions],
          ['Avg G', stats.averageGainPercentageFull.toFixed(2)],
          ['Avg L', stats.averageLossPercentageFull.toFixed(2)],
          ['Avg G/L %', stats.averageGainLossPercentageFull.toFixed(2)],
          ['Batting Avg', stats.battingAverageFull.toFixed(2)],
          ['R/R', stats.rrFull.toFixed(2)],
        ],
      },
    ];
  
    return (
      <div className="stats-page">
        <h1>Stats</h1>
        <div className="total-section">
          {statSections.map((section, index) => (
            <div key={index} className="stat-card">
              <h3>{section.title}</h3>
              <ul>
                {section.data.map(([label, value], i) => (
                  <li key={i}>
                    {label}: {value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="histogram-section">
          <h3>Quarter Positions Histogram</h3>
          <Histogram data={stats.quarterHistogram} labels={histogramLabels} />
        </div>
        <div className="histogram-section">
          <h3>Half Positions Histogram</h3>
          <Histogram data={stats.halfHistogram} labels={histogramLabels} />
        </div>
        <div className="histogram-section">
          <h3>Full Positions Histogram</h3>
          <Histogram data={stats.fullHistogram} labels={histogramLabels} />
        </div>
        <div className="histogram-section">
          <h3>Total Positions Histogram</h3>
          <Histogram data={stats.totalHistogram} labels={histogramLabels} />
        </div>
      </div>
    );
  };
  
  export default StatsPage;
  

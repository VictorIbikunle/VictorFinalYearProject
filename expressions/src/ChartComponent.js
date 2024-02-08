import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const ChartComponent = ({ chartRef }) => {
  const [emotionCounts, setEmotionCounts] = useState([0.1, 0.5, 0.3, 7, 7, 0, 0]);
  const socket = socketIOClient("http://127.0.0.1:5000");

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    console.log(emotionCounts)
    console.log("hello")

    const chart = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"],
        datasets: [{
          label: "Emotion Counts",
          data: emotionCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Subscribe to socket.io events to update the chart
    socket.on("emotion_data", (data) => {
      const emotionIndex = ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"].indexOf(data.emotion);
      if (emotionIndex !== -1) {
        const updatedCounts = [...emotionCounts];
        updatedCounts[emotionIndex]++;
        setEmotionCounts(updatedCounts);

        // Update the chart with the new counts
        chart.data.datasets[0].data = updatedCounts;
        chart.update();
      }
    });

    return () => {
      chart.destroy();
      socket.disconnect();
    };
  }, [chartRef, emotionCounts, socket]);

  return (
    <div>
      <p>Emotion Chart</p>
      <canvas ref={chartRef} width="400" height="200" />
    </div>
  );
};

export default ChartComponent;

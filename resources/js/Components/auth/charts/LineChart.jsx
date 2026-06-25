import React from 'react'
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins :{
            legend: {
                position: 'top'
            }, title: {
                display: true,
                text: 'Line Chart',
            }
        }
    };

    const labels = ['Jan', 'Feb', 'Mar', 'April', 'May'];

    const data = {
        labels: labels,
        datasets: [
            {
                label : 'Sales',
                data : [1700, 1900, 1500, 3000, 2500],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130,246, 0.3)',
                tension: 0.4,
                fill: true,
            },
            {
                label : 'Orders',
                data : [1100, 800, 1200, 750, 1180],
                borderColor: '#4882F6',
                backgroundColor: 'rgba(59, 130,246, 0.3)',
                tension: 0.4,
                fill: true,
            }
        ],
    }
    return (
        <div className='h-120 w-full'>
            <Line data={data} options={options} />
        </div>
    )
}

export default LineChart
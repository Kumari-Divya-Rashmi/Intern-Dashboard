// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// import React, { useEffect, useState } from "react";
// import "./App.css";

// function App() {
//   const [intern, setIntern] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/intern")
//       .then((res) => res.json())
//       .then((data) => setIntern(data));
//   }, []);

//   return (
//     <div className="app">
//       <h1>Intern Dashboard</h1>
//       <div className="login">Login / Signup (Dummy)</div>
//       {intern && (
//         <div className="dashboard">
//           <p><strong>Name:</strong> {intern.name}</p>
//           <p><strong>Referral Code:</strong> {intern.referralCode}</p>
//           <p><strong>Total Donations:</strong> ${intern.totalDonations}</p>
//           <div className="rewards">
//             <h3>Rewards / Unlockables</h3>
//             <ul>
//               <li>🎁 Gift Card</li>
//               <li>🏆 Certificate</li>
//               <li>🚀 LinkedIn Endorsement</li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;

// import './App.css';

// function App() {
//   return (
//     <div className="container">
//       <h1>Intern Dashboard</h1>
//       <div className="login-bar">Login / Signup (Dummy)</div>

//       <div className="card">
//         <p><strong>Name:</strong> John Doe</p>
//         <p><strong>Referral Code:</strong> johndoe2025</p>
//         <p><strong>Total Donations:</strong> $12345</p>

//         <p><strong>Rewards / Unlockables</strong></p>
//         <ul>
//           <li>🎁 Gift Card</li>
//           <li>📜 Certificate</li>
//           <li>🚀 LinkedIn Endorsement</li>
//         </ul>
//       </div>
//     </div>
//   );
// }
// export default App;

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="container">
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
      </button>

      <h1>Intern Dashboard</h1>
      <div className="login-bar">Login / Signup (Dummy)</div>

      <div className="card">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Referral Code:</strong> johndoe2025</p>
        <p><strong>Total Donations:</strong> $12345</p>

        <p><strong>Rewards / Unlockables</strong></p>
        <ul>
          <li>🎁 Gift Card</li>
          <li>📜 Certificate</li>
          <li>🚀 LinkedIn Endorsement</li>
        </ul>
      </div>
    </div>
  );
}

export default App;

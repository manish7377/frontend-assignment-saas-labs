import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const recordsPerPage = 5;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / recordsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getCurrentPageRecords = () => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    return projects.slice(startIndex, startIndex + recordsPerPage);
  };

  return (
    <div className="app-container">
      <h1>SaaS Labs Assignment</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Percentage Funded</th>
                <th>Amount Pledged</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageRecords().map((project, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td>{project["percentage.funded"] || 'N/A'}</td>
                  <td>{project["amt.pledged"] || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
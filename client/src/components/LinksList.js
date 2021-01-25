import React from 'react';
import { Link } from 'react-router-dom';

const LinksList = ({ links }) => {
  return (
    <table style={{paddingTop: '2rem'}}>
      <thead>
      <tr>
        <th>№</th>
        <th>Original Link</th>
        <th>Shortened Link</th>
        <th>Open</th>
      </tr>
      </thead>

      <tbody>
      { links.map((link, index) => {
        return (
          <tr key={link.id}>
            <td>{index + 1}</td>
            <td>{link.from}</td>
            <td>{link.to}</td>
            <td>
              <Link to={`/links/${link.id}`}>Open</Link>
            </td>
          </tr>
        )
      }) }
      </tbody>
    </table>
  );
};

export default LinksList;
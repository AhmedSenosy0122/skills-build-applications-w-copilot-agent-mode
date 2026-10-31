import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Team = {
  name: string;
  mascot?: string;
  members?: string[];
};

export default function Teams() {
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getJson<{ teams: Team[] }>('/api/teams')
      .then(({ teams: records }) => {
        if (!cancelled) setTeams(records);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Teams</h2>
        <p>Manage teams and members.</p>
        {hasError ? (
          <p role="alert">Unable to load teams.</p>
        ) : teams === null ? (
          <p role="status">Loading teams...</p>
        ) : teams.length === 0 ? (
          <p>No teams yet.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {teams.map((team) => (
              <li className="list-group-item" key={team.name}>
                <strong>{team.name}</strong>
                {team.mascot && <span> · {team.mascot}</span>}
                <span className="ms-2 text-body-secondary">{team.members?.length ?? 0} members</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

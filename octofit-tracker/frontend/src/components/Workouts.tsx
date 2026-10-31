import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type WorkoutSuggestion = {
  title: string;
  focus?: string;
  reason?: string;
};

const userEmail = 'mona@example.com';

export default function Workouts() {
  const [suggestions, setSuggestions] = useState<WorkoutSuggestion[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getJson<{ suggestions: WorkoutSuggestion[] }>(`/api/workouts/suggestions/${encodeURIComponent(userEmail)}`)
      .then(({ suggestions: records }) => {
        if (!cancelled) setSuggestions(records);
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
        <h2 className="h4">Workout suggestions</h2>
        <p>Recommend workouts from activity patterns.</p>
        {hasError ? (
          <p role="alert">Unable to load workout suggestions.</p>
        ) : suggestions === null ? (
          <p role="status">Loading workout suggestions...</p>
        ) : suggestions.length === 0 ? (
          <p>No workout suggestions yet.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {suggestions.map((suggestion, itemIndex) => (
              <li className="list-group-item" key={`${suggestion.title}-${itemIndex}`}>
                <strong>{suggestion.title}</strong>
                {suggestion.focus && <span> · {suggestion.focus}</span>}
                {suggestion.reason && <p className="mb-0">{suggestion.reason}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

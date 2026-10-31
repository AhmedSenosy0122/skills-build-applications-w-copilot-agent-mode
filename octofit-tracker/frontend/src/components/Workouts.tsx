import { useState, type FormEvent } from 'react';
import { getJson } from '../api/client.js';

type WorkoutSuggestion = {
  title: string;
  focus?: string;
  reason?: string;
};

export default function Workouts() {
  const [userEmail, setUserEmail] = useState('');
  const [hasRequested, setHasRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<WorkoutSuggestion[] | null>(null);
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedEmail = userEmail.trim();
    if (!selectedEmail) return;

    setHasRequested(true);
    setIsLoading(true);
    setSuggestions(null);
    setHasError(false);
    try {
      const result = await getJson<{ suggestions: WorkoutSuggestion[] }>(
        `/api/workouts/suggestions/${encodeURIComponent(selectedEmail)}`,
      );
      setSuggestions(result.suggestions);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">Workout suggestions</h2>
        <p>Recommend workouts from activity patterns.</p>
        <form className="mb-3" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="workout-user-email">User email</label>
          <div className="d-flex gap-2">
            <input
              className="form-control"
              disabled={isLoading}
              id="workout-user-email"
              onChange={(event) => setUserEmail(event.target.value)}
              required
              type="email"
              value={userEmail}
            />
            <button className="btn btn-primary" disabled={isLoading} type="submit">
              Get suggestions
            </button>
          </div>
        </form>
        {!hasRequested ? (
          <p>Enter your email to view personalized suggestions.</p>
        ) : hasError ? (
          <p role="alert">Unable to load workout suggestions.</p>
        ) : isLoading ? (
          <p role="status">Loading workout suggestions...</p>
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

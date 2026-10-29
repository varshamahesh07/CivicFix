import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/ui';

export default function NotFound() {
  return (
    <div className="container section">
      <EmptyState title="Page not found" action={<Link className="btn btn-primary" to="/">Go to the home page</Link>}>
        The page you are looking for does not exist.
      </EmptyState>
    </div>
  );
}

import { useAuth } from '../context/AuthContext';
import InstructorSessionPage from './InstructorSessionPage';
import StudentSessionPage from './StudentSessionPage';

/**
 * Routes to the correct session page based on user role.
 */
export default function SessionPage() {
  const { isInstructor } = useAuth();

  return isInstructor ? <InstructorSessionPage /> : <StudentSessionPage />;
}

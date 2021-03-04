import PasswordReset from '../components/PasswordReset';
import Reset from '../components/Reset';

export default function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <PasswordReset />
      </div>
    );
  }
  console.log(query);
  return (
    <div>
      <Reset token={query.token} />
    </div>
  );
}

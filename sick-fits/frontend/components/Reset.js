import { gql, useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
    $token: String!
    $password: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    email: '',
    password: '',
    token,
  });
  const [reset, { loading, data }] = useMutation(REQUEST_RESET_MUTATION, {
    variables: inputs,
  });
  const error = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(error);
    console.log(inputs);
    const res = await reset().catch(console.error);
    console.log({ res, data, loading });
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.redeemUserPasswordResetToken === null && <p>Password updated</p>}
        <label htmlFor="email">
          Email
          <input
            required
            type="email"
            id="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            required
            type="password"
            name="password"
            id="password"
            value={inputs.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </label>
        <button type="submit">Reset</button>
      </fieldset>
    </Form>
  );
}

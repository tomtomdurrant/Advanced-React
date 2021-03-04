import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      name
      email
    }
  }
`;

export default function SignUp() {
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    email: '',
    password: '',
    name: '',
  });
  const [signUp, { loading, error, data }] = useMutation(SIGN_UP_MUTATION, {
    variables: inputs,
  });
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(inputs);
    const res = await signUp().catch(console.error);
    console.log(res, data, loading, error);
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign up for an account</h2>
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.createUser && <p>Signed up with {data.createUser.email}</p>}
        <label htmlFor="name">
          Name
          <input
            required
            type="text"
            name="name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
            placeholder="Name"
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            required
            type="email"
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
            value={inputs.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </label>
        <button type="submit">Sign In</button>
      </fieldset>
    </Form>
  );
}

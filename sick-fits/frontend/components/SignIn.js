import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const SIGN_IN_MUTATION = gql`
  mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { inputs, handleChange, resetForm, clearForm } = useForm({
    email: '',
    password: '',
  });
  const [signIn, { loading, error, data }] = useMutation(SIGN_IN_MUTATION, {
    variables: inputs,
    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(inputs);
    const res = await signIn();
    console.log('res is', res);
    console.log('data is ', data?.authenticateUserWithPassword?.code);
    resetForm();
    if (
      res.data?.authenticateUserWithPassword?.__typename ===
      'UserAuthenticationWithPasswordSuccess'
    ) {
      console.log('pushing');
      Router.push({
        pathname: '/',
      });
    }
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign in to your account</h2>
      <DisplayError error={data?.authenticateUserWithPassword} />
      <fieldset disabled={loading} aria-busy={loading}>
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

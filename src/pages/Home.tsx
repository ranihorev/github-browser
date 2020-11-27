import React from 'react';
import { Button, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export const Home: React.FC = () => {
  const history = useHistory();
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          history.push(`/user/${e.currentTarget.user.value}/repos`);
        }}
        className="w-96 max-w-full px-4 flex items-center flex-col"
      >
        <div className="mb-2">Enter Github user</div>
        <TextField variant="outlined" name="user" fullWidth className="mb-4" required />
        <Button type="submit" variant="contained" color="primary">
          Get User Repos
        </Button>
      </form>
    </div>
  );
};

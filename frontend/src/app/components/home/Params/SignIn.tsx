import Button from '../../ui/Button';

export default function SignIn() {
  return (
    <>
      <form action="" className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="username"
          className="text-black"
          required
        />
        <input
          type="password"
          placeholder="password"
          className="text-black"
          required
        />
        <Button>Sign-in</Button>
      </form>
    </>
  );
}

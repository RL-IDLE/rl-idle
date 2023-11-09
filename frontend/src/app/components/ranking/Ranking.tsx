import { useUserStore } from "@/contexts/user.store";
import { useEffect } from "react";

export default function Ranking() {
  const user = useUserStore((state) => state.user);
  const fakeUsersScores = [
    {
      username: 'toto',
      score: 100,
      prestige: 
    },
    {
      username: 'titi',
      score: 200,
    },
    {
      username: 'tata',
      score: 300,
    },
    {
      username: 'tutu',
      score: 400,
    },
  ];

  useEffect(() => {
    console.log(user);
  }, [user]);
    
  
  return (
    <section>
      <h1>Classement</h1>
      <div className="flex flex-col">
        {fakeUsersScores.map((user, index) => (
          <div key={index} className="flex justify-between">
            <p>{index + 1}</p>
            <p>{user.username}</p>
            <p>{user.score}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

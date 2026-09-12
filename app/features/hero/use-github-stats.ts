import { useEffect, useState } from "react";

interface GithubStats {
  publicRepos: number | null;
  followers: number | null;
  loading: boolean;
  error: boolean;
}

export function useGithubStats(username: string): GithubStats {
  const [stats, setStats] = useState<GithubStats>({
    publicRepos: null,
    followers: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    if (!username) {
      setStats({ publicRepos: null, followers: null, loading: false, error: true });
      return;
    }

    let cancelled = false;

    fetch(`https://api.github.com/users/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("GitHub request failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setStats({
          publicRepos: data.public_repos ?? null,
          followers: data.followers ?? null,
          loading: false,
          error: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setStats({ publicRepos: null, followers: null, loading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return stats;
}

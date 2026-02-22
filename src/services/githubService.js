import { Octokit } from "@octokit/rest";

export const materializeGitHubRepo = async (token, repoName, fileData) => {
  const octokit = new Octokit({ auth: token });

  try {
    // 1. Create the repository
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: true,
      auto_init: true, // Creates an initial empty commit so we have a 'main' branch
    });

    const owner = repo.owner.login;
    const name = repo.name;

    // 2. Get the latest commit SHA from the main branch
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo: name,
      ref: "heads/main",
    });
    const latestCommitSha = ref.object.sha;

    // 3. Create Blobs and Tree objects
    // We map your fileData { "path": "content" } into GitHub Tree objects
    const treeItems = Object.entries(fileData).map(([path, content]) => ({
      path,
      mode: "100644", // Normal file mode
      type: "blob",
      content,
    }));

    const { data: tree } = await octokit.git.createTree({
      owner,
      repo: name,
      tree: treeItems,
      base_tree: latestCommitSha,
    });

    // 4. Create the Commit
    const { data: commit } = await octokit.git.createCommit({
      owner,
      repo: name,
      message: "Aristotle file",
      tree: tree.sha,
      parents: [latestCommitSha],
    });

    // 5. Update the Reference (Push)
    await octokit.git.updateRef({
      owner,
      repo: name,
      ref: "heads/main",
      sha: commit.sha,
    });

    return repo.html_url;
  } catch (error) {
    console.error("GitHub Materialization Failed:", error);
    throw error;
  }
};

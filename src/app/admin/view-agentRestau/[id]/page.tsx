// FILE: app/admin/view-agentRestau/[id]/page.tsx
// A temporary, minimal version for testing the build.

// No "use client" and NO IMPORTS.

interface AdminViewAgentPageProps {
  params: {
    id: string;
  };
}

export default function AdminViewAgentPage({ params }: AdminViewAgentPageProps) {
  return (
    <div>
      <h1>Testing Page</h1>
      <p>The ID from the URL is: {params.id}</p>
    </div>
  );
}
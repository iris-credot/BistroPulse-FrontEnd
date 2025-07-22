// FILE: app/admin/view-agentRestau/[id]/page.tsx

import RestaurantAgentOverview from "../../../../../components/restaurantAgent"; // FIX: Correctly import the component

// Define the props that Next.js passes to a dynamic page
interface AdminViewAgentPageProps {
  params: {
    id: string; // The 'id' comes from the folder name [id]
  };
}

// This is the actual Page component that Next.js renders
export default function AdminViewAgentPage({ params }: AdminViewAgentPageProps) {
  // Extract the id from the params object
  const ownerId = params.id;

  // Render the reusable component and pass the id as the ownerId prop
  // The component will now handle its own data fetching
  return <RestaurantAgentOverview ownerId={ownerId} />;
}
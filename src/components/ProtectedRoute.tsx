// "use client";
// // import { useCurrentUser } from "@/hooks/useAuth";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { Spin } from "antd";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   //   const { data: user, isLoading, error } = useCurrentUser();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading && (error || !user)) {
//       router.push("/login");
//     }
//   }, [user, isLoading, error, router]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Spin size="large" tip="Loading..." />
//       </div>
//     );
//   }

//   if (error || !user) {
//     return null;
//   }

//   return <>{children}</>;
// }

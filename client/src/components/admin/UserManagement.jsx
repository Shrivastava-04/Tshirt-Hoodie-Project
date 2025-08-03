// // client/src/components/admin/UserManagement.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Eye, Loader2 } from "lucide-react"; // Loader for loading state

// // Assuming you have a Modal component (you might need to adapt/create this)
// // import UserDetailsModal from './UserDetailsModal'; // Create this component if needed

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

//   // State for modal (if you implement a user details modal)
//   // const [selectedUser, setSelectedUser] = useState(null);
//   // const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await axios.get(`${API_BASE_URL}/admin/users`);
//         setUsers(response.data.users);
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         setError(err.response?.data?.message || "Failed to fetch users.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUsers();
//   }, [API_BASE_URL]);

//   const handleViewDetails = (user) => {
//     // setSelectedUser(user);
//     // setIsModalOpen(true);
//     alert(
//       `User Details for: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`
//     );
//     // Implement a proper modal later
//   };

//   if (loading) {
//     return (
//       <Card className="bg-card/50 border-border/50 p-6 flex items-center justify-center">
//         <Loader2 className="h-6 w-6 animate-spin mr-2" />
//         <p>Loading users...</p>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="bg-card/50 border-destructive/50 p-6 text-destructive">
//         <p>Error: {error}</p>
//       </Card>
//     );
//   }

//   return (
//     <Card className="bg-card/50 border-border/50">
//       <CardHeader>
//         <CardTitle className="text-2xl gradient-text">
//           All Users ({users.length})
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {users.length === 0 ? (
//           <p className="text-foreground/70 text-center py-4">No users found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {users.map((user) => (
//                   <TableRow key={user._id}>
//                     <TableCell className="font-medium">{user.name}</TableCell>
//                     <TableCell>{user.email}</TableCell>
//                     <TableCell>{user.role}</TableCell>
//                     <TableCell className="text-right">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleViewDetails(user)}
//                       >
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                       {/* Add Delete User button here later (use with caution!) */}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         )}
//       </CardContent>
//       {/* {isModalOpen && (
//         <UserDetailsModal
//           user={selectedUser}
//           onClose={() => setIsModalOpen(false)}
//         />
//       )} */}
//     </Card>
//   );
// };

// export default UserManagement;
// client/src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";

import UserDetailsModal from "./UserDetailsModal"; // <--- Import the new modal component

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  // --- NEW STATES FOR MODAL ---
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // --- END NEW STATES ---

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${API_BASE_URL}/admin/users`);
        setUsers(response.data.users);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.message || "Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API_BASE_URL]);

  const handleViewDetails = (user) => {
    setSelectedUser(user); // Set the user to display
    setIsModalOpen(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Clear selected user when closing
  };

  if (loading) {
    return (
      <Card className="bg-card/50 border-border/50 p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading users...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/50 border-destructive/50 p-6 text-destructive">
        <p>Error: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl gradient-text">
          All Users ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-foreground/70 text-center py-4">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">
                      {user.role}
                    </TableCell>{" "}
                    {/* Capitalize role */}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {/* Add Delete User button here later (use with caution!) */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* --- NEW: User Details Modal Render --- */}
      {selectedUser && ( // Only render if a user is selected
        <UserDetailsModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
      {/* --- END NEW --- */}
    </Card>
  );
};

export default UserManagement;

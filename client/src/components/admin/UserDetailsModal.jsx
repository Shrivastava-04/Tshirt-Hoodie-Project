// client/src/components/admin/UserDetailsModal.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Shadcn Dialog components
import { Button } from "@/components/ui/button"; // Shadcn Button
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Globe,
  Info,
} from "lucide-react"; // Icons for user details

// Props:
// - user: The user object to display (e.g., { _id, name, email, phoneNumber, role, createdAt, ... })
// - isOpen: Boolean to control modal visibility
// - onClose: Function to call when the modal should close

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  if (!user) {
    return null; // Don't render if no user is provided
  }

  // Format creation date for better readability
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card/90 border-border/50 backdrop-blur-sm text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text flex items-center gap-2">
            <UserIcon className="h-6 w-6" /> User Details
          </DialogTitle>
          <DialogDescription className="text-foreground/70">
            View comprehensive information about this user.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="flex items-center space-x-3">
            <UserIcon className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold text-lg">{user.name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold text-lg">{user.email}</p>
            </div>
          </div>

          {/* Phone Number (Conditional) */}
          {user.phoneNumber && (
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-semibold text-lg">{user.phoneNumber}</p>
              </div>
            </div>
          )}

          {/* Role */}
          <div className="flex items-center space-x-3">
            <Info className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-semibold text-lg capitalize">{user.role}</p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-semibold text-lg">{memberSince}</p>
            </div>
          </div>

          {/* User ID (Optional, for debugging/admin reference) */}
          <div className="flex items-center space-x-3 text-sm text-muted-foreground break-all">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <p>ID: {user._id}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          {/* You could add more action buttons here, e.g., "Edit User", "Delete User" */}
          {/* <Button variant="destructive">Delete User</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;

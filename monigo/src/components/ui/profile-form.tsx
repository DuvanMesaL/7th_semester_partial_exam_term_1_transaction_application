import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types/user";
import { updateUserProfile } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileFormProps {
  user: User;
  onUpdate: (userData: User) => void;
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<Partial<User>>({
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    age: user.age,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User information not found",
        variant: "destructive",
      });
      return;
    }

    const updatedFields = Object.keys(profileData).reduce<Partial<User>>((acc, key) => {
      const typedKey = key as keyof User;
      
      if (profileData[typedKey] !== undefined && profileData[typedKey] !== user[typedKey]) {
        acc[typedKey] = profileData[typedKey] as any;
      }
    
      return acc;
    }, {});
    
    if (Object.keys(updatedFields).length === 0) {
      toast({
        title: "No changes detected",
        description: "No fields have been modified",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = await updateUserProfile(user.id, updatedFields);
      onUpdate({ ...user, ...updatedUser });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <motion.div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">First Name</Label>
              <Input id="name" name="name" value={profileData.name || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" name="lastname" value={profileData.lastname || ""} onChange={handleChange} />
            </div>
          </motion.div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={profileData.email || ""} onChange={handleChange} />
          </div>

          <motion.div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" value={profileData.phone || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" min="18" max="100" value={profileData.age || ""} onChange={handleChange} />
            </div>
          </motion.div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting || success} className="relative">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : success ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

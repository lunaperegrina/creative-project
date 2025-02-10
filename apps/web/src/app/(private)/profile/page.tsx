"use client"

import { useState } from "react"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  avatar: z.string().url().optional(),
})

// Mock user data (replace with actual data fetching in a real application)
const mockUser: Partial<User> = {
  id: 1,
  username: "johndoe",
  email: "john@example.com",
  walletBalance: 500,
  totalSpent: 1000,
  avatar: "/placeholder.svg",
  role: "CUSTOMER",
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState(mockUser)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      avatar: user.avatar || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically send a request to update the user data
    console.log(values)
    setUser({ ...user, ...values })
    setIsEditing(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>View and edit your profile details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
            <AvatarFallback>{user.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Enter a valid URL for your avatar image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Username</Label>
              <p>{user.username}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p>{user.email}</p>
            </div>
            <div>
              <Label>Wallet Balance</Label>
              <p>${user.walletBalance}</p>
            </div>
            <div>
              <Label>Total Spent</Label>
              <p>${user.totalSpent}</p>
            </div>
            <div>
              <Label>Role</Label>
              <p>{user.role}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="ml-auto">
            Edit Profile
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

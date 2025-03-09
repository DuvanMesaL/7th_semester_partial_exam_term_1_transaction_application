import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Home, CreditCard, BarChart3, ArrowLeftRight, User, X } from "lucide-react"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation()

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Accounts",
      path: "/accounts",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Transfer",
      path: "/transfer",
      icon: <ArrowLeftRight className="h-5 w-5" />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Banking App</h2>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-65px)]">
            <div className="p-4">
              <nav className="flex flex-col gap-2">
                {routes.map((route) => (
                  <Link key={route.path} to={route.path} onClick={() => setOpen(false)}>
                    <Button
                      variant={location.pathname === route.path ? "default" : "ghost"}
                      className="w-full justify-start"
                    >
                      {route.icon}
                      <span className="ml-2">{route.name}</span>
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:border-r">
        <div className="flex items-center h-16 px-4 border-b">
          <h2 className="text-lg font-semibold">Banking App</h2>
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 p-4">
            {routes.map((route) => (
              <Link key={route.path} to={route.path}>
                <Button
                  variant={location.pathname === route.path ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    location.pathname === route.path && "bg-primary text-primary-foreground",
                  )}
                >
                  {route.icon}
                  <span className="ml-2">{route.name}</span>
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}

export default Sidebar


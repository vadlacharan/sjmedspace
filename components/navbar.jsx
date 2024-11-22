import * as React from "react"
import Link from "next/link"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { IconClipboardHeart } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useTheme } from "next-themes"
import { Icon } from "lucide-react"

export function Navbar() {
  const { setTheme, theme } = useTheme()

  return (
    (<div className="border-b">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <span className="font-bold text-xl text-teal-600 flex items-center">
                   <IconClipboardHeart />
                    MedSpace
                  </span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul
                  className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-teal-500 to-teal-700 p-6 no-underline outline-none focus:shadow-md"
                        href="/">
                        <div className="mt-4 text-lg font-medium text-white">MedSpace</div>
                        <p className="text-sm leading-tight text-white/90">
                          Empowering medical education through innovative technology
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/publications" title="Publications">
                    Access cutting-edge medical research and articles
                  </ListItem>
                  <ListItem href="/programs" title="Programs">
                    Explore our comprehensive medical education programs
                  </ListItem>
                  <ListItem href="#" title="Community">
                    Connect with peers and experts in the medical field
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Theme"
            className="mr-6"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <SunIcon
              className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon
              className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle Theme</span>
          </Button>
          <Button  className="bg-teal-600 hover:bg-teal-700">
            <Link href={'/login'}>Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>)
  );
}

const ListItem = React.forwardRef(({ className, title, children, ...props }, ref) => {
  return (
    (<li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>)
  );
})
ListItem.displayName = "ListItem"


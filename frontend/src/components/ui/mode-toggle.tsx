import { Moon, Sun } from 'lucide-react';
import { Button } from './button';
import { useTheme } from './theme-provider';

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <Button
      className="h-12 w-12 flex items-center justify-center rounded-xl"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
    >
      {/* Ícone do Sol */}
      <Sun
        className={`h-12 w-12 transition-all ${
          theme === 'dark' ? 'text-white' : 'rotate-90 scale-0'
        }`}
      />
      {/* Ícone da Lua */}
      <Moon
        className={`absolute h-12 w-12 transition-all ${
          theme === 'dark' ? 'rotate-90 scale-0' : 'text-black'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

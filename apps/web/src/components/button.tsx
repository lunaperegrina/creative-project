import * as React from "react";

import { Button } from "./ui/button";

interface HighlightedButtonProps extends React.ComponentProps<"button"> {}

const HighlightedButton = React.forwardRef<HTMLInputElement, HighlightedButtonProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <Button
        className={`bg-[#5143F1] hover:bg-[#38327b] hover:text-white text-white font-semibold rounded-full ${className}`}
        {...props}
        {...ref}
      >
        {props.children}
      </Button>
    );
  }
);
HighlightedButton.displayName = "HighlightedButton";

export { HighlightedButton };

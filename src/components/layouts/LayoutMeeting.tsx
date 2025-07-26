import React from "react";

interface LayoutMeetingProps {
  children: React.ReactNode;
}
const LayoutMeeting = ({ children }: LayoutMeetingProps) => {
  return <div>{children}</div>;
};

export default LayoutMeeting;

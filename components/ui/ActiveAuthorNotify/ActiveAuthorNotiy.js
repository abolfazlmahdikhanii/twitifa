"use client";

import { ArrowRight, Bell, ChevronDown, Users } from "lucide-react";
import Link from "next/link";
import useActiveAuthor from "@/hooks/useActiveAuthor";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@heroui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ActiveAuthorNotify({ userId }) {
  const shouldReduceMotion = useReducedMotion();
  const { activeAuthors, isChecking, clearNotifications } =
    useActiveAuthor(userId);
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    if (activeAuthors.length > 0) {
      setTimeout(() => setIsShow(true), 0);
      const timer = setTimeout(() => {
        setIsShow(false);
        // clearNotifications();
      }, 8000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [activeAuthors]);

  if (activeAuthors.length === 0) return null;
  const reduced = shouldReduceMotion;

  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          initial={
            reduced ? { opacity: 0 } : { y: -100, opacity: 0, scale: 0.95 }
          }
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { y: -100, opacity: 0, scale: 0.95 }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  type: "spring",
                  damping: 25,
                  stiffness: 500,
                  duration: 0.3,
                }
          }
          className={`flex items-center justify-between fixed top-2 left-1/2 -translate-x-1/2 bg-[#1A1A31] w-[320px] rounded-xl py-3 z-10 px-3 transition-transform slide-in-from-top-5`}
        >
          <div className="flex items-center gap-x-4">
            <div className="flex items-center">
              {activeAuthors.slice(0, 4).map((author, index) => (
                <Avatar
                  key={author.author?._id}
                  className={`w-9 h-9  shadow-md  ${index < 3 ? "-ml-2" : ""}`}
                >
                  <AvatarImage
                    src={author.author.avatar}
                    alt={author.author.username}
                  />
                  <AvatarFallback className=" font-bold text-sm">
                    {author.author.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <p>پست جدید</p>
          </div>
          <Button variant="tertiary" isIconOnly size="sm">
            <ChevronDown />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

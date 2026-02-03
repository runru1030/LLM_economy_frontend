"use client";
import ThreadList, { NewThreadButton } from "@features/economy-agent/ui/thread-list";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@shared/ui/drawer";
import { useState } from "react";
import { MdMenu } from "react-icons/md";
import { useGetThreadList } from "../api";

export default function ThreadListDrawer({ threadId }: { threadId: string | null }) {
  const [open, setOpen] = useState(false);
  const query = useGetThreadList({ enabled: open });

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <MdMenu size={18} />
      </DrawerTrigger>
      <DrawerContent className="p-3">
        <DrawerHeader className="p-0">
          <DrawerTitle className="hidden" />
          <DrawerDescription className="hidden" />
          <NewThreadButton onClick={handleClose} />
        </DrawerHeader>
        <ThreadList.ListContainer>
          {query.data?.map((thread) => (
            <ThreadList.Item
              key={thread.thread_id}
              current={threadId === thread.thread_id}
              subject={thread.subject}
              threadId={thread.thread_id}
              onClick={handleClose}
            />
          ))}
        </ThreadList.ListContainer>
      </DrawerContent>
    </Drawer>
  );
}

"use client";
import ThreadList, { NewThreadButton } from "@features/economy-agent/ui/thread-list";
import {
  Drawer,
  DrawerClose,
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

  return (
    <Drawer direction="left" open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <MdMenu />
      </DrawerTrigger>
      <DrawerContent className="p-3">
        <DrawerHeader className="p-0">
          <DrawerTitle className="hidden" />
          <DrawerDescription className="hidden" />
          <DrawerClose className="self-end">
            <NewThreadButton />
          </DrawerClose>
        </DrawerHeader>
        <ThreadList.ListContainer>
          {query.data?.map((thread) => (
            <DrawerClose className="w-full" key={thread.thread_id}>
              <ThreadList.Item
                current={threadId === thread.thread_id}
                subject={thread.subject}
                threadId={thread.thread_id}
              />
            </DrawerClose>
          ))}
        </ThreadList.ListContainer>
      </DrawerContent>
    </Drawer>
  );
}

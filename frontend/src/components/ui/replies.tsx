import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ApiSuccessResponse, Reply, User } from '@/types';
import { useTranslation } from 'react-i18next';
import { Reply as ReplyComponent } from './reply';
import { ScrollArea } from './scroll-area';
import { useEffect, useState } from 'react';
import { Methods, useApiRequest } from '@/hooks/use-api-request';

interface Props {
  repliesData: Reply[];
  postId: string;
}
export function Replies({ repliesData, postId }: Props) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [mentions, setMentions] = useState<Map<string, User>>();
  const { request } = useApiRequest();
  const defaultUser: User = {
    _id: '',
    email: 'unknown@email.com',
    name: 'Unknown',
    lastname: 'User',
    profilePic: '',
    username: '',
    email_verified: false,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  const getUsers = async () => {
    const usersMap = new Map<string, User>();
    await Promise.all(
      Array.from(new Set(repliesData.map((reply) => reply.author))).map(
        async (authorId) => {
          const response = await request<User>(
            `/users/${authorId}`,
            Methods.GET,
            {
              'Content-Type': 'application/json',
            }
          );
          if (!response.success) return;
          const { data } = response as ApiSuccessResponse<User>;
          usersMap.set(authorId, data);
        }
      )
    );

    setUsers(usersMap);
  };

  const getMentions = async () => {
    const usersMap = new Map<string, User>();
    await Promise.all(
      Array.from(new Set(repliesData.map((reply) => reply.mention))).map(
        async (mentionId) => {
          const response = await request<User>(
            `/users/${mentionId}`,
            Methods.GET,
            { 'Content-Type': 'application/json' }
          );
          if (!response.success) return;
          const { data } = response as ApiSuccessResponse<User>;

          usersMap.set(mentionId, data);
        }
      )
    );

    setMentions(usersMap);
  };
  useEffect(() => {
    getUsers();
    getMentions();
  }, [repliesData]);

  return (
    <Accordion
      type="single"
      collapsible
      className={`w-full ${repliesData.length === 0 ? 'hidden' : ''}`}
    >
      <AccordionItem value="replies">
        <AccordionTrigger className="text-xs justify-center underline text-gray-500">
          {t('view replies')}
        </AccordionTrigger>
        <AccordionContent className="p-0">
          <ScrollArea className="my-3 max-h-32 overflow-y-auto flex flex-col gap-4 sm:px-6">
            {repliesData.map((reply, index) => (
              <ReplyComponent
                replyProp={reply}
                user={users.get(reply.author) ?? defaultUser}
                mention={
                  mentions?.get(reply.mention)?.username ?? 'deletedUser'
                }
                postId={postId}
                key={index}
              />
            ))}
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

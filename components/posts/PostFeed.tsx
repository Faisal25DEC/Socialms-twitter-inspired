import usePosts from "@/hooks/usePosts";
import PostItem from "./PostItem";
import { ClipLoader } from "react-spinners";

interface PostFeedProps {
  userId?: string;
}

const PostFeed: React.FC<PostFeedProps> = ({ userId }) => {
  const { data: posts = [] } = usePosts(userId);

  return (
    <>
      {posts.length > 0 ? (
        posts.map((post: Record<string, any>) => {
          return <PostItem userId={userId} key={post.id} data={post} />;
        })
      ) : (
        <div className="flex justify-center items-center">
          <ClipLoader color="lightblue" size={70} />
        </div>
      )}
    </>
  );
};

export default PostFeed;

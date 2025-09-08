import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DialogBox from "@/components/DialogBox";
import { useStacks } from "@/hooks/useStacks";
import { useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoaderOne } from "@/components/ui/loader";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Homepage() {
  const { fetchStacks, stacks, isLoading } = useStacks();
  const navigate = useNavigate();

  useEffect(() => {
    const loadStacks = async () => {
      try {
        await fetchStacks();
      } catch {
        toast.error("Error loading stacks. Try Again.");
      }
    };

    loadStacks();
  }, [fetchStacks]);

  return (
    <div className="min-h-[90vh] flex flex-col gap-8 p-8">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <LoaderOne />
        </div>
      ) : (
        <>
          <div className="flex justify-between border-b-2 pb-4">
            <div className="font-bold text-2xl">My Stacks</div>
            <DialogBox onStackCreated={fetchStacks} />
          </div>

          {!stacks.length ? (
            <div className="flex-grow flex items-center justify-center">
              <Card className="w-96 bg-white">
                <CardHeader>
                  <CardTitle>Create New Stack</CardTitle>
                  <CardDescription>
                    Start building your generative AI apps with our essential
                    tools and frameworks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DialogBox onStackCreated={fetchStacks} />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {stacks.map((stack) => (
                <Card key={stack.id} className="w-full bg-white">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{stack.name}</CardTitle>
                    </div>
                    <CardDescription>{stack.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-end">
                    <Button
                      onClick={() => navigate(`/${stack.id}`)}
                      className="bg-white hover:bg-white"
                      variant="outline"
                    >
                      <span>Edit Stack</span> <ExternalLink />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Homepage;

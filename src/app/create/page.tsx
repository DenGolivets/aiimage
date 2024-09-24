"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const formSchema = z.object({
  prompt: z.string().min(7, {
    message: "Prompt must be at least 7 characters.",
  }),
});

const models = ["turbo", "flux", "flux-realism", "flux-anime", "flux-3d"];

export default function CreatePage() {
  const [outputImg, setOutputImg] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedModel, setSelectedModel] = React.useState<string>("flux");

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const randomSeed = Math.floor(Math.random() * 100000000) + 1;

      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          model: selectedModel,
          seed: randomSeed,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setOutputImg(data.url);
      } else {
        console.log(data.error);
        toast({
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-dvh h-full lg:h-dvh p-3 flex justify-start items-center pt-[72px] flex-col">
      <div className="w-full p-3">
        <h1 className="text-center font-bold text-white text-4xl">Create</h1>
        <p className="text-white/60 text-lg text-center">
          Generate Amazing Images from Text using AI Models for Free
        </p>
      </div>
      <div className="flex w-full h-[calc(100vh-200px)] gap-3 md:flex-row flex-col">
        <div className="__form h-full flex-[2] gap-2 flex justify-center items-start flex-col">
          <p className="text-center lg:text-left text-sm text-white/80 w-full">
            Type your prompt below to create any image
          </p>
          <div className="flex gap-2 w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex gap-2"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="w-full lg:max-w-[70%] max-w-full">
                      <FormControl>
                        <Input
                          placeholder="a cat sitting on a bench."
                          className="w-full transition-all border-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  loading={loading}
                  type="submit"
                  className="font-semibold"
                >
                  Generate
                </Button>
              </form>
            </Form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mt-2">Select Model: {selectedModel}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {models.map((model) => (
                <DropdownMenuItem
                  key={model}
                  onClick={() => setSelectedModel(model)}
                >
                  {model}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="__output min-h-[300px] lg:min-h-full lg:h-full flex-[1] bg-white/5 flex items-center justify-center rounded-lg relative overflow-hidden">
          {outputImg ? (
            <Image
              src={outputImg}
              alt=""
              width={500}
              height={500}
              className="w-[600px] h-[500px] lg:w-full lg:h-full object-contain"
            />
          ) : (
            <>
              <div className="w-full h-full flex justify-center items-center text-white/70 text-center p-3">
                Enter your prompt and hit generate!
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

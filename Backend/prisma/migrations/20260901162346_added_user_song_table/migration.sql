-- CreateTable
CREATE TABLE "public"."UserSong" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserSong_userId_idx" ON "public"."UserSong"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSong_userId_songId_key" ON "public"."UserSong"("userId", "songId");

-- AddForeignKey
ALTER TABLE "public"."UserSong" ADD CONSTRAINT "UserSong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSong" ADD CONSTRAINT "UserSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

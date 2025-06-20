/*
  Warnings:

  - Added the required column `chatRoomId` to the `InviteCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `InviteCode` ADD COLUMN `chatRoomId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `InviteCode` ADD CONSTRAINT `InviteCode_chatRoomId_fkey` FOREIGN KEY (`chatRoomId`) REFERENCES `ChatRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

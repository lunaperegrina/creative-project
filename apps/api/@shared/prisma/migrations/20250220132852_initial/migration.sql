-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'DESIGNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "CreativeType" AS ENUM ('VIDEO', 'IMAGE', 'DEEPFAKE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "walletBalance" INTEGER DEFAULT 0,
    "totalSpent" INTEGER DEFAULT 0,
    "emailVerified" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "active" BOOLEAN DEFAULT true,
    "avatar" TEXT,
    "role" "Role" DEFAULT 'CLIENT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hash" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "CreativeType" NOT NULL,
    "copy" TEXT,
    "niche" TEXT,
    "vision" TEXT,
    "reference" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creative" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "designerId" INTEGER,

    CONSTRAINT "Creative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Token_hash_key" ON "Token"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_key" ON "Token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Creative_orderId_key" ON "Creative"("orderId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creative" ADD CONSTRAINT "Creative_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creative" ADD CONSTRAINT "Creative_designerId_fkey" FOREIGN KEY ("designerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

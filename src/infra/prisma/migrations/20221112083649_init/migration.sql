-- CreateTable
CREATE TABLE "User" (
    "userId" BIGSERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "userProfilePic" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "expenseTypes" TEXT[] DEFAULT ARRAY['Credit', 'Debit']::TEXT[],
    "expenseWays" TEXT[] DEFAULT ARRAY['Cash', 'Bank Transfer', 'UPI']::TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "expenseId" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "value" INTEGER NOT NULL,
    "expenseType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expenseWay" TEXT NOT NULL,
    "accountId" BIGINT
);

-- CreateTable
CREATE TABLE "Notes" (
    "noteId" BIGSERIAL NOT NULL,
    "noteText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("noteId")
);

-- CreateTable
CREATE TABLE "Account" (
    "accountId" BIGSERIAL NOT NULL,
    "userId" BIGINT,
    "accountLabel" TEXT NOT NULL,
    "credit" BIGINT NOT NULL DEFAULT 0,
    "debit" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("accountId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Expenses_expenseId_key" ON "Expenses"("expenseId");

-- CreateIndex
CREATE UNIQUE INDEX "Notes_noteId_key" ON "Notes"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountId_key" ON "Account"("accountId");

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

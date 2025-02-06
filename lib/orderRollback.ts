import prisma from "@/lib/prisma";


export async function rollbackOrder(orderId: string) {
  try {
    await prisma.order.delete({ where: { id: orderId } })
    console.log(`Rolled back order ${orderId}`)
  } catch (rollbackError) {
    console.error(`Failed to rollback order ${orderId}:`, rollbackError)
  }
}
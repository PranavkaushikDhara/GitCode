class Solution {
    public int[] dailyTemperatures(int[] arr) {
        
        int n=arr.length;
        Stack<Integer> stack = new Stack<>();
        int[] res=new int[n];
        for(int i=0;i<n;i++){
            while(!stack.isEmpty() && arr[i]>arr[stack.peek()]){
                int ind= stack.pop();
                res[ind]=i-ind;
            }
            stack.push(i);
        }

        return res;
    }
}
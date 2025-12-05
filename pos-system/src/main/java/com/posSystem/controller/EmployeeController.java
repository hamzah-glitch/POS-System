package com.posSystem.controller;

import com.posSystem.domain.UserRole;
import com.posSystem.models.User;
import com.posSystem.payload.dto.UserDto;
import com.posSystem.payload.response.ApiResponse;
import com.posSystem.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    @PostMapping("/store/{storeId}")
    public ResponseEntity<UserDto> createStoreEmployee(
            @RequestBody UserDto userDto,
            @PathVariable Long storeId) throws Exception {
        UserDto employee = employeeService.createStoreEmployee(userDto, storeId);
        return ResponseEntity.ok(employee);
    }

    @PostMapping("/branch/{branchId}")
    public ResponseEntity<UserDto> createBranchEmployee(
            @RequestBody UserDto userDto,
            @PathVariable Long branchId) throws Exception {
        UserDto employee = employeeService.createBranchEmployee(userDto,branchId);
        return ResponseEntity.ok(employee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateEmployee(
            @RequestBody UserDto userDto,
            @PathVariable Long id) throws Exception {
        User employee = employeeService.updateEmployee(id,userDto);
        return ResponseEntity.ok(employee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteEmployee(
            @PathVariable Long id) throws Exception {
        employeeService.deleteEmployee(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("employee deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }


    @GetMapping("/store/{id}")
    public ResponseEntity<List<UserDto>> storeEmployee(
            @PathVariable Long id,
            @RequestParam(required = false)UserRole userRole) throws Exception {
        List<UserDto> employee = employeeService.findStoreEmployees(id,userRole);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/branch/{id}")
    public ResponseEntity<List<UserDto>> branchEmployee(
            @PathVariable Long id,
            @RequestParam(required = false)UserRole userRole) throws Exception {
        List<UserDto> employee = employeeService.findBranchEmployees(id,userRole);
        return ResponseEntity.ok(employee);
    }

    @GetMapping()
    public ResponseEntity<List<UserDto>> getAllEmployee() throws Exception {
        List<UserDto> employee = employeeService.getAllEmployees();
        return ResponseEntity.ok(employee);
    }

}

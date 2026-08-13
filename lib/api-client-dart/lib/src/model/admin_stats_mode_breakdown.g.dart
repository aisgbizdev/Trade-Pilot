// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'admin_stats_mode_breakdown.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$AdminStatsModeBreakdown extends AdminStatsModeBreakdown {
  @override
  final int beginner;
  @override
  final int pro;

  factory _$AdminStatsModeBreakdown(
          [void Function(AdminStatsModeBreakdownBuilder)? updates]) =>
      (AdminStatsModeBreakdownBuilder()..update(updates))._build();

  _$AdminStatsModeBreakdown._({required this.beginner, required this.pro})
      : super._();
  @override
  AdminStatsModeBreakdown rebuild(
          void Function(AdminStatsModeBreakdownBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AdminStatsModeBreakdownBuilder toBuilder() =>
      AdminStatsModeBreakdownBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AdminStatsModeBreakdown &&
        beginner == other.beginner &&
        pro == other.pro;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, beginner.hashCode);
    _$hash = $jc(_$hash, pro.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AdminStatsModeBreakdown')
          ..add('beginner', beginner)
          ..add('pro', pro))
        .toString();
  }
}

class AdminStatsModeBreakdownBuilder
    implements
        Builder<AdminStatsModeBreakdown, AdminStatsModeBreakdownBuilder> {
  _$AdminStatsModeBreakdown? _$v;

  int? _beginner;
  int? get beginner => _$this._beginner;
  set beginner(int? beginner) => _$this._beginner = beginner;

  int? _pro;
  int? get pro => _$this._pro;
  set pro(int? pro) => _$this._pro = pro;

  AdminStatsModeBreakdownBuilder() {
    AdminStatsModeBreakdown._defaults(this);
  }

  AdminStatsModeBreakdownBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _beginner = $v.beginner;
      _pro = $v.pro;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AdminStatsModeBreakdown other) {
    _$v = other as _$AdminStatsModeBreakdown;
  }

  @override
  void update(void Function(AdminStatsModeBreakdownBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AdminStatsModeBreakdown build() => _build();

  _$AdminStatsModeBreakdown _build() {
    final _$result = _$v ??
        _$AdminStatsModeBreakdown._(
          beginner: BuiltValueNullFieldError.checkNotNull(
              beginner, r'AdminStatsModeBreakdown', 'beginner'),
          pro: BuiltValueNullFieldError.checkNotNull(
              pro, r'AdminStatsModeBreakdown', 'pro'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

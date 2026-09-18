// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_summary.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupSummary extends TopupSummary {
  @override
  final int totalAmountRupiah;
  @override
  final int totalCreditsGranted;
  @override
  final int approvedRequestCount;
  @override
  final BuiltList<TopupUserSummary> byUser;
  @override
  final BuiltList<TopupMonthSummary> byMonth;

  factory _$TopupSummary([void Function(TopupSummaryBuilder)? updates]) =>
      (TopupSummaryBuilder()..update(updates))._build();

  _$TopupSummary._(
      {required this.totalAmountRupiah,
      required this.totalCreditsGranted,
      required this.approvedRequestCount,
      required this.byUser,
      required this.byMonth})
      : super._();
  @override
  TopupSummary rebuild(void Function(TopupSummaryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupSummaryBuilder toBuilder() => TopupSummaryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupSummary &&
        totalAmountRupiah == other.totalAmountRupiah &&
        totalCreditsGranted == other.totalCreditsGranted &&
        approvedRequestCount == other.approvedRequestCount &&
        byUser == other.byUser &&
        byMonth == other.byMonth;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, totalAmountRupiah.hashCode);
    _$hash = $jc(_$hash, totalCreditsGranted.hashCode);
    _$hash = $jc(_$hash, approvedRequestCount.hashCode);
    _$hash = $jc(_$hash, byUser.hashCode);
    _$hash = $jc(_$hash, byMonth.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupSummary')
          ..add('totalAmountRupiah', totalAmountRupiah)
          ..add('totalCreditsGranted', totalCreditsGranted)
          ..add('approvedRequestCount', approvedRequestCount)
          ..add('byUser', byUser)
          ..add('byMonth', byMonth))
        .toString();
  }
}

class TopupSummaryBuilder
    implements Builder<TopupSummary, TopupSummaryBuilder> {
  _$TopupSummary? _$v;

  int? _totalAmountRupiah;
  int? get totalAmountRupiah => _$this._totalAmountRupiah;
  set totalAmountRupiah(int? totalAmountRupiah) =>
      _$this._totalAmountRupiah = totalAmountRupiah;

  int? _totalCreditsGranted;
  int? get totalCreditsGranted => _$this._totalCreditsGranted;
  set totalCreditsGranted(int? totalCreditsGranted) =>
      _$this._totalCreditsGranted = totalCreditsGranted;

  int? _approvedRequestCount;
  int? get approvedRequestCount => _$this._approvedRequestCount;
  set approvedRequestCount(int? approvedRequestCount) =>
      _$this._approvedRequestCount = approvedRequestCount;

  ListBuilder<TopupUserSummary>? _byUser;
  ListBuilder<TopupUserSummary> get byUser =>
      _$this._byUser ??= ListBuilder<TopupUserSummary>();
  set byUser(ListBuilder<TopupUserSummary>? byUser) => _$this._byUser = byUser;

  ListBuilder<TopupMonthSummary>? _byMonth;
  ListBuilder<TopupMonthSummary> get byMonth =>
      _$this._byMonth ??= ListBuilder<TopupMonthSummary>();
  set byMonth(ListBuilder<TopupMonthSummary>? byMonth) =>
      _$this._byMonth = byMonth;

  TopupSummaryBuilder() {
    TopupSummary._defaults(this);
  }

  TopupSummaryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _totalAmountRupiah = $v.totalAmountRupiah;
      _totalCreditsGranted = $v.totalCreditsGranted;
      _approvedRequestCount = $v.approvedRequestCount;
      _byUser = $v.byUser.toBuilder();
      _byMonth = $v.byMonth.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TopupSummary other) {
    _$v = other as _$TopupSummary;
  }

  @override
  void update(void Function(TopupSummaryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupSummary build() => _build();

  _$TopupSummary _build() {
    _$TopupSummary _$result;
    try {
      _$result = _$v ??
          _$TopupSummary._(
            totalAmountRupiah: BuiltValueNullFieldError.checkNotNull(
                totalAmountRupiah, r'TopupSummary', 'totalAmountRupiah'),
            totalCreditsGranted: BuiltValueNullFieldError.checkNotNull(
                totalCreditsGranted, r'TopupSummary', 'totalCreditsGranted'),
            approvedRequestCount: BuiltValueNullFieldError.checkNotNull(
                approvedRequestCount, r'TopupSummary', 'approvedRequestCount'),
            byUser: byUser.build(),
            byMonth: byMonth.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'byUser';
        byUser.build();
        _$failedField = 'byMonth';
        byMonth.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TopupSummary', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

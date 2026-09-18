// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_month_summary.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TopupMonthSummary extends TopupMonthSummary {
  @override
  final String month;
  @override
  final int totalAmountRupiah;
  @override
  final int totalCreditsGranted;
  @override
  final int requestCount;

  factory _$TopupMonthSummary(
          [void Function(TopupMonthSummaryBuilder)? updates]) =>
      (TopupMonthSummaryBuilder()..update(updates))._build();

  _$TopupMonthSummary._(
      {required this.month,
      required this.totalAmountRupiah,
      required this.totalCreditsGranted,
      required this.requestCount})
      : super._();
  @override
  TopupMonthSummary rebuild(void Function(TopupMonthSummaryBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupMonthSummaryBuilder toBuilder() =>
      TopupMonthSummaryBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupMonthSummary &&
        month == other.month &&
        totalAmountRupiah == other.totalAmountRupiah &&
        totalCreditsGranted == other.totalCreditsGranted &&
        requestCount == other.requestCount;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, month.hashCode);
    _$hash = $jc(_$hash, totalAmountRupiah.hashCode);
    _$hash = $jc(_$hash, totalCreditsGranted.hashCode);
    _$hash = $jc(_$hash, requestCount.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupMonthSummary')
          ..add('month', month)
          ..add('totalAmountRupiah', totalAmountRupiah)
          ..add('totalCreditsGranted', totalCreditsGranted)
          ..add('requestCount', requestCount))
        .toString();
  }
}

class TopupMonthSummaryBuilder
    implements Builder<TopupMonthSummary, TopupMonthSummaryBuilder> {
  _$TopupMonthSummary? _$v;

  String? _month;
  String? get month => _$this._month;
  set month(String? month) => _$this._month = month;

  int? _totalAmountRupiah;
  int? get totalAmountRupiah => _$this._totalAmountRupiah;
  set totalAmountRupiah(int? totalAmountRupiah) =>
      _$this._totalAmountRupiah = totalAmountRupiah;

  int? _totalCreditsGranted;
  int? get totalCreditsGranted => _$this._totalCreditsGranted;
  set totalCreditsGranted(int? totalCreditsGranted) =>
      _$this._totalCreditsGranted = totalCreditsGranted;

  int? _requestCount;
  int? get requestCount => _$this._requestCount;
  set requestCount(int? requestCount) => _$this._requestCount = requestCount;

  TopupMonthSummaryBuilder() {
    TopupMonthSummary._defaults(this);
  }

  TopupMonthSummaryBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _month = $v.month;
      _totalAmountRupiah = $v.totalAmountRupiah;
      _totalCreditsGranted = $v.totalCreditsGranted;
      _requestCount = $v.requestCount;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TopupMonthSummary other) {
    _$v = other as _$TopupMonthSummary;
  }

  @override
  void update(void Function(TopupMonthSummaryBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupMonthSummary build() => _build();

  _$TopupMonthSummary _build() {
    final _$result = _$v ??
        _$TopupMonthSummary._(
          month: BuiltValueNullFieldError.checkNotNull(
              month, r'TopupMonthSummary', 'month'),
          totalAmountRupiah: BuiltValueNullFieldError.checkNotNull(
              totalAmountRupiah, r'TopupMonthSummary', 'totalAmountRupiah'),
          totalCreditsGranted: BuiltValueNullFieldError.checkNotNull(
              totalCreditsGranted, r'TopupMonthSummary', 'totalCreditsGranted'),
          requestCount: BuiltValueNullFieldError.checkNotNull(
              requestCount, r'TopupMonthSummary', 'requestCount'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

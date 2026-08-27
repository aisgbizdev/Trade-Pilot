// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'outbound_click_stats.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$OutboundClickStats extends OutboundClickStats {
  @override
  final int windowDays;
  @override
  final int totalAllTime;
  @override
  final int totalInWindow;
  @override
  final BuiltList<OutboundClickStatsByPlacementInner> byPlacement;
  @override
  final BuiltList<OutboundClickStatsByTargetInner> byTarget;

  factory _$OutboundClickStats(
          [void Function(OutboundClickStatsBuilder)? updates]) =>
      (OutboundClickStatsBuilder()..update(updates))._build();

  _$OutboundClickStats._(
      {required this.windowDays,
      required this.totalAllTime,
      required this.totalInWindow,
      required this.byPlacement,
      required this.byTarget})
      : super._();
  @override
  OutboundClickStats rebuild(
          void Function(OutboundClickStatsBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  OutboundClickStatsBuilder toBuilder() =>
      OutboundClickStatsBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is OutboundClickStats &&
        windowDays == other.windowDays &&
        totalAllTime == other.totalAllTime &&
        totalInWindow == other.totalInWindow &&
        byPlacement == other.byPlacement &&
        byTarget == other.byTarget;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, windowDays.hashCode);
    _$hash = $jc(_$hash, totalAllTime.hashCode);
    _$hash = $jc(_$hash, totalInWindow.hashCode);
    _$hash = $jc(_$hash, byPlacement.hashCode);
    _$hash = $jc(_$hash, byTarget.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'OutboundClickStats')
          ..add('windowDays', windowDays)
          ..add('totalAllTime', totalAllTime)
          ..add('totalInWindow', totalInWindow)
          ..add('byPlacement', byPlacement)
          ..add('byTarget', byTarget))
        .toString();
  }
}

class OutboundClickStatsBuilder
    implements Builder<OutboundClickStats, OutboundClickStatsBuilder> {
  _$OutboundClickStats? _$v;

  int? _windowDays;
  int? get windowDays => _$this._windowDays;
  set windowDays(int? windowDays) => _$this._windowDays = windowDays;

  int? _totalAllTime;
  int? get totalAllTime => _$this._totalAllTime;
  set totalAllTime(int? totalAllTime) => _$this._totalAllTime = totalAllTime;

  int? _totalInWindow;
  int? get totalInWindow => _$this._totalInWindow;
  set totalInWindow(int? totalInWindow) =>
      _$this._totalInWindow = totalInWindow;

  ListBuilder<OutboundClickStatsByPlacementInner>? _byPlacement;
  ListBuilder<OutboundClickStatsByPlacementInner> get byPlacement =>
      _$this._byPlacement ??= ListBuilder<OutboundClickStatsByPlacementInner>();
  set byPlacement(
          ListBuilder<OutboundClickStatsByPlacementInner>? byPlacement) =>
      _$this._byPlacement = byPlacement;

  ListBuilder<OutboundClickStatsByTargetInner>? _byTarget;
  ListBuilder<OutboundClickStatsByTargetInner> get byTarget =>
      _$this._byTarget ??= ListBuilder<OutboundClickStatsByTargetInner>();
  set byTarget(ListBuilder<OutboundClickStatsByTargetInner>? byTarget) =>
      _$this._byTarget = byTarget;

  OutboundClickStatsBuilder() {
    OutboundClickStats._defaults(this);
  }

  OutboundClickStatsBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _windowDays = $v.windowDays;
      _totalAllTime = $v.totalAllTime;
      _totalInWindow = $v.totalInWindow;
      _byPlacement = $v.byPlacement.toBuilder();
      _byTarget = $v.byTarget.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(OutboundClickStats other) {
    _$v = other as _$OutboundClickStats;
  }

  @override
  void update(void Function(OutboundClickStatsBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  OutboundClickStats build() => _build();

  _$OutboundClickStats _build() {
    _$OutboundClickStats _$result;
    try {
      _$result = _$v ??
          _$OutboundClickStats._(
            windowDays: BuiltValueNullFieldError.checkNotNull(
                windowDays, r'OutboundClickStats', 'windowDays'),
            totalAllTime: BuiltValueNullFieldError.checkNotNull(
                totalAllTime, r'OutboundClickStats', 'totalAllTime'),
            totalInWindow: BuiltValueNullFieldError.checkNotNull(
                totalInWindow, r'OutboundClickStats', 'totalInWindow'),
            byPlacement: byPlacement.build(),
            byTarget: byTarget.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'byPlacement';
        byPlacement.build();
        _$failedField = 'byTarget';
        byTarget.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'OutboundClickStats', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint

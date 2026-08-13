// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'outbound_click_stats_by_placement_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$OutboundClickStatsByPlacementInner
    extends OutboundClickStatsByPlacementInner {
  @override
  final String placement;
  @override
  final String target;
  @override
  final int count;

  factory _$OutboundClickStatsByPlacementInner(
          [void Function(OutboundClickStatsByPlacementInnerBuilder)?
              updates]) =>
      (OutboundClickStatsByPlacementInnerBuilder()..update(updates))._build();

  _$OutboundClickStatsByPlacementInner._(
      {required this.placement, required this.target, required this.count})
      : super._();
  @override
  OutboundClickStatsByPlacementInner rebuild(
          void Function(OutboundClickStatsByPlacementInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  OutboundClickStatsByPlacementInnerBuilder toBuilder() =>
      OutboundClickStatsByPlacementInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is OutboundClickStatsByPlacementInner &&
        placement == other.placement &&
        target == other.target &&
        count == other.count;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, placement.hashCode);
    _$hash = $jc(_$hash, target.hashCode);
    _$hash = $jc(_$hash, count.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'OutboundClickStatsByPlacementInner')
          ..add('placement', placement)
          ..add('target', target)
          ..add('count', count))
        .toString();
  }
}

class OutboundClickStatsByPlacementInnerBuilder
    implements
        Builder<OutboundClickStatsByPlacementInner,
            OutboundClickStatsByPlacementInnerBuilder> {
  _$OutboundClickStatsByPlacementInner? _$v;

  String? _placement;
  String? get placement => _$this._placement;
  set placement(String? placement) => _$this._placement = placement;

  String? _target;
  String? get target => _$this._target;
  set target(String? target) => _$this._target = target;

  int? _count;
  int? get count => _$this._count;
  set count(int? count) => _$this._count = count;

  OutboundClickStatsByPlacementInnerBuilder() {
    OutboundClickStatsByPlacementInner._defaults(this);
  }

  OutboundClickStatsByPlacementInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _placement = $v.placement;
      _target = $v.target;
      _count = $v.count;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(OutboundClickStatsByPlacementInner other) {
    _$v = other as _$OutboundClickStatsByPlacementInner;
  }

  @override
  void update(
      void Function(OutboundClickStatsByPlacementInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  OutboundClickStatsByPlacementInner build() => _build();

  _$OutboundClickStatsByPlacementInner _build() {
    final _$result = _$v ??
        _$OutboundClickStatsByPlacementInner._(
          placement: BuiltValueNullFieldError.checkNotNull(
              placement, r'OutboundClickStatsByPlacementInner', 'placement'),
          target: BuiltValueNullFieldError.checkNotNull(
              target, r'OutboundClickStatsByPlacementInner', 'target'),
          count: BuiltValueNullFieldError.checkNotNull(
              count, r'OutboundClickStatsByPlacementInner', 'count'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
